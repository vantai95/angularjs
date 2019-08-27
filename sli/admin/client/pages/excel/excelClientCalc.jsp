<%@ page language="java"
    contentType="application/vnd.ms-excel; charset=euc-kr"
    pageEncoding="EUC-KR" import="java.util.*"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<%@ page import="java.text.SimpleDateFormat"%>
<%
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
    String today = format.format(new Date());

    response.setHeader("Content-Type", "application/vnd.ms-xls");
    response.setHeader("Content-Disposition", "attachment; filename=client_pay_" + today + ".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko" style="overflow: hidden">
<head>
<meta http-equiv="content-type" content="text/html; euc-kr" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>엑셀 다운로드</title>
<style>
.table-wrapper-scroll-y {
    display: block;
    max-height: 700px;
    overflow-y: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
td, th {border:1px solid gray}
</style>
</head>
<body>
    <table style="background: #ffffff">
    	<tbody>
    		<tr>
    			<th style="border:none">정산기간</th>
    			<td colspan="3" style="border:none">${info.startDt} ~ ${info.endDt}</td>
    		</tr>
    		<tr>
    			<td style="border:none"></td>
    		</tr>
    		<tr>
    			<th style="background-color:#eeeeee">업체명</th>
    			<th style="background-color:#eeeeee">강사명</th>
    			<th style="background-color:#eeeeee">강의명</th>
    			<th style="background-color:#eeeeee">강의기간</th>
    			<th style="background-color:#eeeeee">강의시간</th>
    			<th style="background-color:#eeeeee">수업횟수</th>
    			<th style="background-color:#eeeeee">단위</th>
    			<th style="background-color:#eeeeee">단가</th>
    			<th style="background-color:#eeeeee">면세여부</th>
    			<th style="background-color:#eeeeee">기타항목</th>
    			<th style="background-color:#eeeeee">청구금액</th>
    			<th style="background-color:#eeeeee">최종정산금액</th>
    			<th style="background-color:#eeeeee">총 청구금액</th>
    			<th style="background-color:#eeeeee">총 VAT</th>
    			<th style="background-color:#eeeeee">총 금액</th>
    			<th style="background-color:#eeeeee">비고</th>
    			<th style="background-color:#eeeeee">수업일자</th>
    			<th style="background-color:#eeeeee">정산완료</th>
    		</tr>
        	<c:forEach var="x" items="${list}" varStatus="status">
        		<tr>
        			<td>${x.compNm}</td>
        			<td>${x.teacherNm}</td>
        			<td>${x.lectureNm}</td>
        			<td>${x.startDt} ~ ${x.endDt}</td>
        			<td>
        				<c:forEach var="y" items="${x.schedules}" varStatus="status2">
        					${y}<br>
        				</c:forEach>
        			</td>
        			<td style="text-align:center">${x.attCnt}</td>
        			<td style="text-align:center">${x.feeUnitNm}</td>
        			<td><fmt:formatNumber value="${x.tuitionFee}" pattern="#,###" /></td>
        			<td style="text-align:center">${x.freeYnNm}</td>
        			<td><fmt:formatNumber value="${x.addMoney}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.totalFee}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.lastMoney}" pattern="#,###" /></td>
        			
        			<td><fmt:formatNumber value="${x.lastMoney + x.addMoney}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.totalVat}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.lastMoney + x.addMoney + x.totalVat}" pattern="#,###" /></td>

        			<td>${x.lastRemark}</td>
        			<td>
        				<c:forEach var="y" items="${x.dayList }" varStatus="status2">
        					[${y.month}월] ${y.day}<br>
        				</c:forEach>
					</td>
        			<td>${x.complete}</td>
        		</tr>
        		<c:if test="${fn:length(x.itemList) > 0 }">
        			<tr>
        				<th colspan="10" style="border:none"></th>
        				<th style="background-color:#eeeeee">항목</th>
        				<th style="background-color:#eeeeee">단가</th>
        				<th style="background-color:#eeeeee">수량</th>
        				<th style="background-color:#eeeeee">금액</th>
        				<th style="background-color:#eeeeee">면세여부</th>
        				<th style="background-color:#eeeeee">일자</th>
        			</tr>
        			<c:forEach var="y" items="${x.itemList }" varStatus="status2">
        				<tr>
        					<td colspan="10" style="border:none"></td>
        					<td>${y.itemCnts}</td>
        					<td><fmt:formatNumber value="${y.cost}" pattern="#,###" /></td>
        					<td><fmt:formatNumber value="${y.qnty}" pattern="#,###" /></td>
        					<td><fmt:formatNumber value="${y.cost * y.qnty}" pattern="#,###" /></td>
        					<td>${y.freeYnNm}</td>
        					<td>${y.selectDt}</td>
        				</tr>
        			</c:forEach>
        		</c:if>
            </c:forEach>
        </tbody>
    </table>
 
</body>
</html>
